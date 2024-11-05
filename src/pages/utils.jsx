export const filterTopics = (topics, statusFilter) => {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    return topics.filter((topic) => {
        const topicEndDate = new Date(topic.endDate);
        const isExpired = topicEndDate < today;
        const isSoonToExpire = topicEndDate <= threeDaysFromNow;

        if (statusFilter === 'expired') {
            return isExpired;
        } else if (statusFilter === 'soonToExpire') {
            return isSoonToExpire && !isExpired;
        } else if (statusFilter === 'active') {
            return !isExpired && !isSoonToExpire;
        }
        return true;
    });
};
