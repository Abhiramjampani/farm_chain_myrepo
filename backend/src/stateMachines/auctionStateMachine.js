const { createMachine } = require("xstate");

const auctionMachine = createMachine({
    id: "auction",
    initial: "open",
    states: {
        open: {
            on: { 
                CLOSE: "closed", 
                CANCEL: "cancelled",
                EXPIRE: "expired"
            }
        },
        closed: {
            on: { 
                AWARD: "awarded",
                REOPEN: "open"
            }
        },
        awarded: {
            type: "final"
        },
        expired: {
            type: "final"
        },
        cancelled: {
            type: "final"
        }
    }
});

function canTransition(currentState, event) {
    const stateNode = auctionMachine.states[currentState];
    if (!stateNode || !stateNode.on) return false;
    return event in stateNode.on;
}

function getNextState(currentState, event) {
    const stateNode = auctionMachine.states[currentState];
    if (!stateNode || !stateNode.on) return currentState;
    return stateNode.on[event] || currentState;
}

module.exports = { 
    auctionMachine, 
    canTransition, 
    getNextState 
};
