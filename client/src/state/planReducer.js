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
      case 'plan/readingCompleted': {
        const { planId, day } = action.payload;
        return {
          plans: [
            ...state.plans.map(item => {
              if(item.id !== planId) {
                return item
              } else {
                return {...item, ...item.plan_scheme[day].completed = true}
              }
            })
          ]
        }
      }
      case 'plan/updateScheme': {
        const { planId, newScheme } = action.payload;
        return {
          plans: [
            ...state.plans.map(item => {
              if(item.id !== planId) {
                return item
              } else {
                let newItem = item;
                newItem.plan_scheme = newScheme 
                return newItem;
              }
            })
          ]
        }
      }
      case 'plan/clearPlans': {
        return {
          plans: []
        }
      }
      default: {
        return state;
      }
    }
}

export default planReducer;