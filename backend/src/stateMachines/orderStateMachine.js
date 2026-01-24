const { createMachine } = require("xstate");

const orderMachine = createMachine({
    id: "order",
    initial: "pending",
    states: {
        pending: {
            on: { 
                CONFIRM: "confirmed", 
                CANCEL: "cancelled" 
            }
        },
        confirmed: {
            on: { 
                SHIP: "shipped",
                CANCEL: "cancelled"
            }
        },
        shipped: {
            on: { 
                DELIVER: "delivered" 
            }
        },
        delivered: {
            on: { 
                COMPLETE: "completed" 
            }
        },
        completed: { type: "final" },
        cancelled: { type: "final" }
    }
});

function canTransition(currentState, event) {
    const stateNode = orderMachine.states[currentState];
    if (!stateNode || !stateNode.on) return false;
    return event in stateNode.on;
}

function getNextState(currentState, event) {
    const stateNode = orderMachine.states[currentState];
    if (!stateNode || !stateNode.on) return currentState;
    return stateNode.on[event] || currentState;
}

function getAllowedEvents(currentState) {
    const stateNode = orderMachine.states[currentState];
    if (!stateNode || !stateNode.on) return [];
    return Object.keys(stateNode.on);
}

function isFinalState(state) {
    return state === 'completed' || state === 'cancelled';
}

module.exports = { 
    orderMachine, 
    canTransition, 
    getNextState, 
    getAllowedEvents,
    isFinalState
};
