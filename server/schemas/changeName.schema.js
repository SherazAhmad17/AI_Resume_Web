import * as z from "zod"

const changeNameSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long")
})

export default changeNameSchema