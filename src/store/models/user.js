export const user = {
    state: {
        uid: null,
        username: null,
        email: null,
        role: null,
    },
    reducers: {
        setUser(state, payload) {
            return payload;
        }
    }
}