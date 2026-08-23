export function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "seller":
      return "/seller/dashboard";
    default:
      return "/dashboard"; // সাধারণ user হলে নিজেদের ড্যাশবোর্ড/প্রোফাইলে যাবে
  }
}