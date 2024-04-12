export const initialState = {
    blueprint: [],
    cart: [], // Add initial state for cart
    user: null,
};

// Selector

export const getblueprintTotal = (blueprint) =>
    blueprint?.reduce((amount, item) => item.price + amount, 0);
    

const reducer = (state, action) => {
    switch(action.type) {
        case 'ADD_TO_blueprint':
            // Logic for adding item to blueprint
            return {
                ...state,
                blueprint: [...state.blueprint, action.item],
            };
        case 'REMOVE_FROM_blueprint':
            // Logic for removing item from blueprint
            // we cloned the blueprint
            let newblueprint = [...state.blueprint];
            // we check to see if product exists
            const index = state.blueprint.findIndex((blueprintItem) => blueprintItem.id === action.id);
            if (index >= 0) {
                // item exists in blueprint, remove it...
                newblueprint.splice(index, 1);
            }
            return {
                ...state,
                blueprint: newblueprint,
            };
        case 'ADD_TO_CART':
            // Logic for adding item to cart
            return {
                ...state,
                cart: [...state.cart, action.item],
            };
        case 'REMOVE_FROM_CART':
            // Logic for removing item from cart
            let newCart = [...state.cart];
            const cartIndex = state.cart.findIndex((cartItem) => cartItem.id === action.id);
            if (cartIndex >= 0) {
                // item exists in cart, remove it...
                newCart.splice(cartIndex, 1);
            }
            return {
                ...state,
                cart: newCart,
            };
        default:
            return state;
    }
};

export default reducer;