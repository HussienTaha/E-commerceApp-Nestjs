

import * as z from "zod";

 export const userValidation = z.strictObject({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),

}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code:"custom",
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
}); 