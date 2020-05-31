export default {
    state: null,
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