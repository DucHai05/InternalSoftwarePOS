const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const products = [{ maSanPham: 'TEST001', tenSanPham: 'Test Coffee', donGia: 30000, maLoaiSanPham: 'COFFEE' }];

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
        localStorage.setItem('maNhanVien', 'TEST-ONLY');
        localStorage.setItem('tenNhanVien', 'Test Staff');
        localStorage.setItem('role', 'STAFF');
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('BROWSER:', error.message); });
    let mode = 'slow';
    const requests = [];
    await page.route('http://localhost:5173/api/**', async route => {
        const url = new URL(route.request().url());
        const currentMode = mode;
        requests.push({ path: url.pathname, time: Date.now(), method: route.request().method() });
        let data = [];
        let delay = 0;
        let status = 200;
        if (url.pathname.endsWith('/v1/san-pham')) {
            data = products; delay = 80;
        } else if (url.pathname.endsWith('/v1/loai-san-pham')) {
            data = [{ maLoaiSanPham: 'COFFEE', tenLoaiSanPham: 'Coffee' }];
            delay = currentMode === 'slow' ? 7000 : 0;
        } else if (url.pathname.includes('/loadBan/')) {
            const id = url.pathname.split('/').pop();
            data = id === 'BAN102' ? null : { maHoaDon: `HD-${id}`, items: [{ maSanPham: 'TEST001', soLuong: 2, giaBan: 30000 }] };
            delay = currentMode === 'switch' && id === 'BAN101' ? 1800 : 400;
        } else if (url.pathname.endsWith('/getMaCaDangMo')) {
            data = 'CA004'; delay = 150;
        } else if (url.pathname.endsWith('/promotions/active')) {
            delay = currentMode === 'slow' ? 1200 : currentMode === 'timeout' ? 7000 : 0;
            if (currentMode === 'fail') { status = 503; data = { error: 'Test promotion unavailable' }; }
        } else if (url.pathname.match(/\/ban\/BAN\d+$/)) {
            data = { tenBan: 'Test Table' };
        } else if (url.pathname.endsWith('/unread-count')) {
            data = 0;
        }
        await sleep(delay);
        try {
            await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
        } catch (error) {
            if (!page.isClosed() && !/closed|intercepted|invalid|handled/i.test(error.message)) throw error;
        }
    });
    try {
        await page.goto('http://localhost:5173/staff/order/BAN101', { waitUntil: 'domcontentloaded' });
        await page.locator('.product-card').waitFor({ state: 'visible' });
        const productRequest = requests.find(request => request.path.endsWith('/v1/san-pham'));
        const billRequest = requests.find(request => request.path.includes('/loadBan/'));
        assert.ok(Math.abs(productRequest.time - billRequest.time) < 250, 'Bill must start concurrently with menu');
        assert.equal(await page.locator('.action-btn.confirm').isDisabled(), true);
        assert.ok(await page.getByRole('status').isVisible(), 'Cart must load separately');
        await page.waitForFunction(() => !document.querySelector('.action-btn.confirm')?.disabled);
        assert.ok(Date.now() - productRequest.time < 5000, 'Slow categories must not block ordering');
        assert.equal(await page.locator('.cart-container').getByText('Test Coffee', { exact: true }).count(), 1);
        console.log('PASS: bill starts in parallel, menu appears early, slow categories do not block checkout');
        fs.mkdirSync('test-results', { recursive: true });
        await page.screenshot({ path: path.resolve('test-results/order-loading-desktop.png'), fullPage: true });

        mode = 'fail';
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.getByRole('alert').filter({ hasText: 'Test promotion unavailable' }).waitFor({ state: 'visible' });
        assert.equal(await page.locator('.action-btn.payment').isDisabled(), true);
        assert.equal(await page.locator('.product-card').getAttribute('aria-disabled'), 'true');
        mode = 'normal';
        await page.getByRole('button', { name: 'Thử lại' }).click();
        await page.waitForFunction(() => !document.querySelector('.action-btn.confirm')?.disabled);
        assert.equal(await page.getByRole('alert').count(), 0);
        console.log('PASS: API failure blocks checkout; retry restores bill and actions');

        mode = 'switch';
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.locator('.product-card').waitFor({ state: 'visible' });
        await page.evaluate(() => {
            history.pushState({}, '', '/staff/order/BAN102');
            dispatchEvent(new PopStateEvent('popstate'));
        });
        await page.waitForFunction(() => !document.querySelector('.action-btn.confirm')?.disabled);
        await sleep(1900);
        assert.equal(await page.locator('.cart-container').getByText('Test Coffee', { exact: true }).count(), 0,
            'Stale bill response must not overwrite the new table');
        await page.locator('.product-card').click();
        assert.equal(await page.locator('.cart-container').getByText('Test Coffee', { exact: true }).count(), 1);
        console.log('PASS: changing tables cancels stale responses and preserves new cart');
        mode = 'timeout';
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.locator('.product-card').waitFor({ state: 'visible' });
        assert.equal(await page.locator('.action-btn.payment').isDisabled(), true);
        await page.getByRole('alert').filter({ hasText: 'Máy chủ phản hồi quá lâu' }).waitFor({ state: 'visible', timeout: 7000 });
        console.log('PASS: slow required API times out with retry and blocked checkout');
        assert.deepEqual(errors, [], 'No unhandled browser errors');
        assert.ok(requests.every(request => request.method === 'GET'), 'Tests must not write to backend');
    } catch (error) {
        console.error('URL:', page.url(), 'BODY:', (await page.locator('body').innerText()).slice(0, 1800));
        console.error('API REQUESTS:', requests);
        fs.mkdirSync('test-results', { recursive: true });
        await page.screenshot({ path: path.resolve('test-results/order-loading-failure.png'), fullPage: true });
        throw error;
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
