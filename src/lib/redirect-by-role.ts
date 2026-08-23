export function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "seller":
      return "/seller/dashboard";
    default:
      return "/"; // সাধারণ user হলে home page (চাইলে অন্য path দাও)
  }
}