import { Home, Car, ShoppingCart, Lightbulb, Umbrella, Heart, CreditCard, Tv, Film, GraduationCap, DollarSign, Gift, Plane, Wallet, Briefcase, Landmark, Coffee, ShoppingBag, Scissors, PiggyBank, DivideIcon as LucideIcon } from "lucide-react";

/**
 * Get the appropriate icon component for a given category
 */
export function getCategoryIcon(category?: string): LucideIcon {
  if (!category) return ShoppingCart;
  
  switch (category.toLowerCase()) {
    case 'housing':
      return Home;
    case 'transportation':
      return Car;
    case 'food':
      return Coffee;
    case 'utilities':
      return Lightbulb;
    case 'insurance':
      return Umbrella;
    case 'healthcare':
      return Heart;
    case 'debt':
      return CreditCard;
    case 'subscriptions':
      return Tv;
    case 'entertainment':
      return Film;
    case 'education':
      return GraduationCap;
    case 'shopping':
      return ShoppingBag;
    case 'personal':
      return Scissors;
    case 'travel':
      return Plane;
    case 'gifts':
      return Gift;
    case 'salary':
      return Briefcase;
    case 'investments':
      return PiggyBank;
    case 'freelance':
      return Wallet;
    case 'refunds':
      return DollarSign;
    default:
      return ShoppingCart;
  }
}

/**
 * Get category suggestion based on transaction title
 */
export function suggestCategory(title: string): string | null {
  const lowerTitle = title.toLowerCase();
  
  // Housing related
  if (/rent|mortgage|apartment|house payment|hoa|property tax/i.test(lowerTitle)) {
    return 'housing';
  }
  
  // Transportation
  if (/gas|fuel|car|auto|uber|lyft|taxi|parking|transit|train|bus|subway|metro/i.test(lowerTitle)) {
    return 'transportation';
  }
  
  // Food
  if (/grocery|restaurant|takeout|food|meal|breakfast|lunch|dinner|cafe|coffee|doordash|ubereats|grubhub/i.test(lowerTitle)) {
    return 'food';
  }
  
  // Utilities
  if (/electric|water|gas bill|internet|wifi|phone|cable|utility|utilities/i.test(lowerTitle)) {
    return 'utilities';
  }
  
  // Subscriptions
  if (/netflix|hulu|spotify|apple|amazon prime|disney|subscription|membership/i.test(lowerTitle)) {
    return 'subscriptions';
  }
  
  // Income categories
  if (/salary|paycheck|direct deposit|payment from/i.test(lowerTitle)) {
    return 'salary';
  }
  
  if (/freelance|consulting|client/i.test(lowerTitle)) {
    return 'freelance';
  }
  
  if (/dividend|interest|investment|stock|crypto/i.test(lowerTitle)) {
    return 'investments';
  }
  
  if (/refund|return|cashback|reimbursement/i.test(lowerTitle)) {
    return 'refunds';
  }
  
  return null; // No suggestion
}