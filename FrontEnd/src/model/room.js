import api from "./api";

const room = class {

    static async create(name, owner, password) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('owner', owner);
        formData.append('password', password);

        const url = '/room/create';
        const response = await api.post(url, formData);

        if (!response.success) {
            throw new Error(response.reason);
        }
        return response;
    }

    static async screen(id, password) {
        const formData = new FormData();
        if (password) {
            formData.append('password', password);
        }

        const url = '/room/' + id + '/screen';
        const response = await api.post(url, formData);

        if (!response.success) {
            throw new Error(response.reason);
        }
        return response;
    }

    static async questionAsk(id, guest, content) {
        const formData = new FormData();
        if (guest) {
            formData.append('owner', guest);
        }
        formData.append('content', content);

        const url = '/room/' + id + '/question/ask';
        const response = await api.post(url, formData);

        if (!response.success) {
            throw new Error(response.reason);
        }
        return response;
    }

    static async questionApprove(room, id, password) {
        const formData = new FormData();
        formData.append('password', password);

        const url = '/room/' + room + '/question/' + id + '/mod';
        const response = await api.post(url, formData);

        if (!response.success) {
            throw new Error(response.reason);
        }
        return response;
    }

    static async questionDelete(room, id, password) {
        const formData = new FormData();
        formData.append('password', password);

        let config = {
            headers: {},
            data: formData
        }

        const url = '/room/' + room + '/question/' + id + '/mod';
        const response = await api.delete(url, config);

        if (!response.success) {
            throw new Error(response.reason);
        }
        return response;
    }

    static async questionAnswer(room, id, password) {
        const formData = new FormData();
        formData.append('password', password);
        formData.append('answer', 1);

        const url = '/room/' + room + '/question/' + id + '/mod';
        const response = await api.post(url, formData);

        if (!response.success) {
            throw new Error(response.reason);
        }
        return response;
    }

}

export default room;
