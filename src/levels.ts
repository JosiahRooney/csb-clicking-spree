const levels = [{ exp: 0 }]
const exponent = 1.333
const baseExp = 255
for (let i = 0; i < 1000; i += 1) {
  const exp = Math.floor(baseExp * (i * exponent))
  levels.push({ exp })
}
export default levels
