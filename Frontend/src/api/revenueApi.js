import { apiClient } from './httpClient';

export const caApi = {
    checkOpenCa: () => apiClient.get('/api/doanhthu/ca/kiem-tra-ca-mo'),
    openCa: (soTienKet, maNhanVien) => apiClient.post('/api/doanhthu/ca/mo-ca', null, { params: { soTienKet, maNhanVien } }),
    closeCa: (maCa) => apiClient.put(`/api/doanhthu/ca/${maCa}/dong-ca`),
    getAll: () => apiClient.get('/api/doanhthu/ca'),
};

export const doanhthuApi = {
    getMaCaDangMo: (config) => apiClient.get('/api/doanhthu/ca/getMaCaDangMo', config),
    getByCa: (maCa) => apiClient.get(`/api/doanhthu/doanhthu/ca/${maCa}`),
    getAll: () => apiClient.get('/api/doanhthu/doanhthu'),
    updateAfterPayment: (maCa, phuongThuc, soTien) => {
        const payload = { amount: soTien, method: phuongThuc };
        return apiClient.put(`/api/doanhthu/doanhthu/update-after-payment/${maCa}`, payload);
    },
};

export const phieuThuChiApi = {
    getByCa: (maCa) => apiClient.get(`/api/doanhthu/phieuthuchi/ca/${maCa}`),
    create: (data) => apiClient.post('/api/doanhthu/phieuthuchi', data),
};
