export {}

// const { annotationDiagnostics } = ctx
// if (annotationDiagnostics) {
//   type.annotations
//     .filter((annotation) => typeof annotation === "object" && annotation?.node === "Assertion")
//     .forEach(({ f, description }) => {
//       if (f) {
//         annotationDiagnostics.push((async () => {
//           try {
//             const passed = await f(ctx.value)
//             if (!passed) {
//               return {
//                 type,
//                 path,
//                 description,
//                 value: ctx.value,
//               }
//             }
//           } catch (exception: unknown) {
//             return {
//               type,
//               path,
//               exception,
//               description,
//               value: ctx.value,
//             }
//           }
//         })())
//       }
//     })
// }
