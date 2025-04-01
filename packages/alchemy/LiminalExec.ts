import { type Context, Resource } from "alchemy"

export interface LiminalExecProps {
  main: string
}

export interface LiminalExec extends Resource<"liminal::Exec">, LiminalExecProps {
  result: string
  createdAt: number
  updatedAt: number
}

export const LiminalExec = Resource(
  "liminal::Exec",
  async function(
    this: Context<LiminalExec, LiminalExecProps>,
    _id: string,
    props: LiminalExecProps,
  ) {
    if (this.phase === "delete") {
      return this.destroy()
    }
    return this.create({
      ...props,
      result: "",
      createdAt: new Date().getDate(),
      updatedAt: new Date().getDate(),
    })
  },
)
