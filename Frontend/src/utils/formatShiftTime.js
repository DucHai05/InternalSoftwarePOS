export const formatShiftTime = (value) => {
    if (!value) return '---';

    if (Array.isArray(value)) {
        const [hours, minutes, seconds = 0] = value;
        return [hours, minutes, seconds]
            .map((part) => String(part).padStart(2, '0'))
            .join(':');
    }

    const match = String(value).match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!match) return String(value);

    const [, hours, minutes, seconds = '00'] = match;
    return `${hours.padStart(2, '0')}:${minutes}:${seconds}`;
};
