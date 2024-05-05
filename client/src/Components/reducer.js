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

        case 'EMPTY_BLUEPRINT':
            return {
              ...state,
              blueprint: [],
            };

        case 'ADD_TO_BLUEPRINT':
             // Logic for adding item to blueprint
             return {
                 ...state,
                 blueprint: [...state.blueprint, action.item],
             };

        case 'ADD_TO_BLUEPRINT_EDIT':
            console.log(action.payload);
            // Check if the part is already in the blueprint
            const partIndex = state.blueprint.findIndex((blueprintItem) => blueprintItem.blueprint_id === action.payload.blueprint_id);
          
            if (partIndex < 0) {
              // Part is not in the blueprint, so add it
              return {
                ...state,
                blueprint: [...state.blueprint, action.payload],
              };
            } else {
              // Part is already in the blueprint, so don't add it
              return state;
            }

            case 'UPDATE_PART_IN_BLUEPRINT':
                // Clone the blueprint
                let updatedBlueprint = [...state.blueprint];
              
                // Check if the part exists in the blueprint
                const updateIndex = updatedBlueprint.findIndex((blueprintItem) => blueprintItem.type === action.item.type);
              
                if (updateIndex >= 0) {
                  // The part exists in the blueprint, update it...
                  updatedBlueprint[updateIndex] = action.item;
                }
              
                return {
                  ...state,
                  blueprint: updatedBlueprint,
                };

        case 'REMOVE_FROM_BLUEPRINT':
            // Logic for removing item from blueprint
            // we cloned the blueprint
            let newblueprint = [...state.blueprint];
            console.log('payload',action.payload)
            console.log(action.uniqueId)
            // we check to see if product exists
            const index = state.blueprint.findIndex((blueprintItem) => blueprintItem.uniqueId === action.id);
            if (index >= 0) {
                // item exists in blueprint, remove it...
                newblueprint.splice(index, 1);
            }
            return {
                ...state,
                blueprint: newblueprint,
            };
        case 'REMOVE_FROM_BLUEPRINT_EDIT':
            return {
                ...state,
                blueprint: state.blueprint.filter(part => part.uniqueId !== action.payload),
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

            case 'EMPTY_CART':
                return {
                  ...state,
                  cart: [],
            };

        default:
            return state;
    }
};

export default reducer;