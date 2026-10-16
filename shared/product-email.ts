/** Product-owned mail identity. Provider credentials must remain server-side.
 * Used for support and product/auth notifications, never as a substitute for
 * a user's connected Gmail/Outlook/Feishu sender.
 */
export const PRODUCT_EMAIL = Object.freeze({
  address: "Flowork@inflowx.ai",
  name: "FloWork",
  from: "FloWork <Flowork@inflowx.ai>",
  replyTo: "Flowork@inflowx.ai",
  support: "Flowork@inflowx.ai",
  notification: "Flowork@inflowx.ai",
  authentication: "Flowork@inflowx.ai",
  mailto: "mailto:Flowork@inflowx.ai",
});
