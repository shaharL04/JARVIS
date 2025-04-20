export const allTools = {
    type: "function",
    name: "calculate_sum",
    description: "Calculates the sum of two numbers.",
    parameters: {
        type: "object",
        properties: {
            a: { type: "number" },
            b: { type: "number" }
        },
        required: ["a", "b"]
    }
};
//# sourceMappingURL=tools.js.map