export default function(...inputs: object[]): object[] {
    return new Proxy(inputs, {
        get: function(target, prop) {
            return target.some(i => i[prop].isDown);
        }
    });
}