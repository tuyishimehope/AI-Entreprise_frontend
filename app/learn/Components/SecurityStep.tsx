import { Stack, Typography, TextField } from "@mui/material";
import z from "zod";

export const securitySchema = z.object({
  password: z.string().min(8, "Password must be 8+ characters"),
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SecurityStep = ({ data, update }: { data: any; update: any }) => (
  <Stack spacing={2} sx={{ width: "100%" }}>
    <Typography variant="h5">Secure Your Account</Typography>
    <TextField
      type="password"
      label="Password"
      value={data.password}
      onChange={(e) => update({ password: e.target.value })}
      fullWidth
    />
  </Stack>
);
export default SecurityStep;
