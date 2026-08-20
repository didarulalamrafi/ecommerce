export function getRedirectPath(role?: string): string {
  switch (role) {
    case "admin":
      return "/admin/products";
    case "seller":
      return "/seller/dashboard"; // আপনার আসল route দিয়ে বদলান
    default:
      return "/dashboard";
  }
}