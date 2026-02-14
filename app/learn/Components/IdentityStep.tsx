import { Stack, Typography, TextField } from "@mui/material";
import z from "zod";

export const identitySchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IdentityStep = ({ data, update }: { data: any; update: any }) => {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography variant="h5">Personal Info</Typography>
      <TextField
        label="Name"
        value={data.name}
        onChange={(e) => update({ name: e.target.value })}
        fullWidth
      />
      <TextField
        label="Email"
        value={data.email}
        onChange={(e) => update({ email: e.target.value })}
        fullWidth
      />
    </Stack>
  );
};

export default IdentityStep;
