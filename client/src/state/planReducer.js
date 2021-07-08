const initialState = {
  plans:[]
}

const planReducer = (state = initialState, action) => {
    switch(action.type) {
      case 'plan/addReadingPlan': {
        return {
          ...state,
          plans: [...state.plans, action.payload]
        }
      }
      case 'plan/removeReadingPlan': {
        return {
          plans: [
            ...state.plans.filter(plan => plan.id !== action.payload)
          ]
        }
      }
      default: {
        return state;
      }
    }
}

export default planReducer;