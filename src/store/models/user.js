export default {
    state: {
        uid: null,
        username: null,
        email: null,
        role: null,
    },
    reducers: {
        setUser(state, payload) {
            return payload;
        },
        setEmail(state, payload) {
            state.email = payload;
            return state;
        },
        setRole(state, payload) {
            state.role = payload;
            return state;
        }
    }
}