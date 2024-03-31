export const initialState = {
    blueprint: [],
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
            } else {
                console.warn(
                    `Can't remove product (id: ${action.id}) as it's not in blueprint!`
                )
                }
            return {
                ...state,
                blueprint: newblueprint
            };
        case 'SET_USER':
            // Logic for setting user
            return {
                ...state,
                user: action.user
            }   
        case 'EMPTY_blueprint':
            return {
                ...state,
                blueprint: []
            }       
        default:
            return state;
    }       
};

export default reducer;