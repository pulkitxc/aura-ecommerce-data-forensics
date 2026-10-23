# AURA SKINCARE: The Data Forensics Sandbox

**The Premise:** 
Most e-commerce dashboards are confidently wrong. They tell you *what* happened, but they completely miss the *why*. They don't tell you if a user hesitated for 3 seconds on the price, or if they abandoned the cart because the shipping fee caused sticker shock.

I built this project to prove a different approach: **Data Forensics**. 

I built a premium e-commerce sandbox (Aura Skincare) from scratch, engineered an 11-layer tracking architecture in GTM/GA4, and designed a Looker Studio dashboard that diagnoses exactly where the funnel is bleeding money. 

This is the breakdown of the 11 inspections I built, the technical dataLayer logic behind them, and why they matter to any D2C brand today.

---

## 🕵️‍♂️ The 11 Inspections

**1. Hero Scroll (Attention Span)**
*   **The Setup:** `scroll` listener checks `window.scrollY`. Calculates time to pass 600px using `Date.now()`. Pushes `scroll_hero_passed` with `time_to_scroll_seconds` and `user_type` (Hunter <3s vs Romantic >3s).
*   **What it actually means:** The "First 3 Seconds Rule." If a user scrolls past your hero in under 3 seconds, they are a "Hunter" – they know what they want and are ignoring your branding. If they take longer, they are a "Romantic" – they are reading your story. 
*   **Business Impact:** If 75% of your traffic are Hunters, you are wasting your most expensive real estate on brand storytelling. Move the product grid up. Show the price. Show the "Add to Cart" button.

**2. Bestseller Hover (Psychological Hesitation)**
*   **The Setup:** `mouseenter` listener with a 3000ms `setTimeout` on product cards. Fires `bestseller_hover` with `product_name`.
*   **What it actually means:** A hover is a digital "pick up and look." If a user holds their cursor over a product for more than 3 seconds, they are in a state of cognitive dissonance. They want the product, but something is blocking the purchase (price, lack of reviews, uncertainty). 
*   **Business Impact:** This is your friction point. If the ₹799 serum gets the most hovers but no clicks, you don't need a new product—you need a "Buy Now, Pay Later" badge or a 5-star review right next to the price.

**3. Ingredient Click (Unmet Demand)**
*   **The Setup:** `setIngredient()` fires `ingredient_click` with `ingredient_name`.
*   **What it actually means:** When users click on an ingredient (e.g., Niacinamide) that isn't in your product line, they are telling you exactly what they want to buy. They are voting with their clicks.
*   **Business Impact:** You just found your next product launch. If 50% of users click on Niacinamide, your R&D team should be formulating a Niacinamide serum by next Monday.

**4. Quick View Open (High Intent)**
*   **The Setup:** `openQuick()` fires `quick_view_open` with `product_id` and `product_name`.
*   **What it actually means:** Opening a modal is the highest step a user can take before "Add to Cart." They are saying, *"I'm interested, convince me."*
*   **Business Impact:** If users open the modal and close it without buying, your product copy isn't working. Test better images, urgency ("Only 2 left"), and social proof inside the modal.

**5. Add to Cart (E-commerce Core)**
*   **The Setup:** `addToCart()` pushes a full GA4 e-commerce payload: `currency`, `value`, `item_id`, `item_name`, `item_category`, `price`, and `quantity`.
*   **What it actually means:** This is the moment the user says "Yes" to the product. 
*   **Business Impact:** Standard data hygiene. Proves your core plumbing works and feeds the GA4 purchase funnel.

**6. Cart Drawer Open (Basket Size)**
*   **The Setup:** `openCart()` runs a `.reduce()` to count items and pushes `cart_drawer_open` with `cart_item_count`.
*   **What it actually means:** A basket size of 1.2 means users are buying a single item. Single-item buyers are fragile. They are one click away from abandoning. Bundles increase stickiness. 
*   **Business Impact:** Your "Frequently Bought Together" upsells are not working. You need to cross-sell a cleanser with the serum, or offer a "Routine Set" discount.

**7. Cart Abandon Shipping (The P&L Leak)**
*   **The Setup:** `closeCart()` fires `cart_abandon_shipping` with `cart_value`, `shipping_gap` (999 - subtotal), and `hit_free_shipping`.
*   **What it actually means:** A user has a cart of ₹850. The free shipping threshold is ₹999. You are asking them to spend ₹149 more on a product they don't need. Most users won't. They will abandon. 
*   **Business Impact:** You are losing lakhs over a ₹149 gap. Lower the threshold to ₹899. Most users will find that gap easier to cross.

**8. Coupon Attempt (Promo Leak)**
*   **The Setup:** `applyPromo()` pushes `coupon_attempt` with `coupon_code` and `coupon_success`.
*   **What it actually means:** When a user has their credit card out and the coupon fails, they feel tricked. The friction at this moment is deadly. 
*   **Business Impact:** Fix expired codes immediately. Or, add a fallback message: *"That code is expired, but here's 5% off for the inconvenience."* Save the sale.

**9. Quiz Start / Complete (Personalization)**
*   **The Setup:** `quiz_start` fires on open. `quiz_complete` fires with `recommended_product`.
*   **What it actually means:** If you ask for data (skin type, concerns), you must deliver a personalized recommendation immediately. If the quiz is too long, the user will drop off. 
*   **Business Impact:** Shorten the quiz to 2 questions. You lose the lead if they get bored.

**10. FAQ Expand (Objections)**
*   **The Setup:** `toggleFaq()` fires `faq_expand` with `faq_question`.
*   **What it actually means:** Every time a user clicks an FAQ, they are answering a specific fear. If 60% click "Do you offer Cash on Delivery?" they don't trust online payments.
*   **Business Impact:** Don't make them dig for trust. Put a COD badge on the product page, and a "Free Returns" banner next to the "Add to Cart" button. 

**11. Exit Intent (Last Chance)**
*   **The Setup:** `mouseleave` on `document` checks if `e.clientY < 0`. Fires `exit_intent` with `page_location`.
*   **What it actually means:** When the cursor moves to the top of the browser, the user is leaving. It's your last chance to save the sale.
*   **Business Impact:** Trigger a "Wait! Get 10% off" popup. It's your last line of defense.

---

## 🏗️ The Hard Work (The Architecture & The Headache)

This wasn't a copy-paste GTM tutorial. I built the entire tracking pipeline from scratch. Here is the technical scope of the build:

*   **Frontend Engineering:** Custom HTML, CSS, and Vanilla JS. No frameworks.
*   **The Data Layer:** Wired 11 custom `window.dataLayer.push()` events directly into the JS functions.
*   **GTM Configuration:** Configured **14 Tags**, **13 Triggers**, and **24 Data Layer Variables**.
*   **GA4 Configuration:** Registered **13 Custom Dimensions** and **3 Custom Metrics** in GA4 Admin.
*   **Visualization:** Built a native Looker Studio dashboard with custom filters and date ranges.

**The biggest headache (The lesson):** 
I spent hours debugging why my Looker Studio dashboard was completely empty. I thought my GTM tags were broken. I thought my JS was broken. I almost gave up. 

Then I realized the truth: **GA4 silently drops custom parameters unless you explicitly register them as Custom Definitions.** I had to go back into GA4 Admin, manually register `product_name`, `user_type`, `cart_value`, and the rest, and refresh the Looker Studio data source. 

That was the moment the dashboard finally lit up. It taught me that the hardest part of analytics isn't writing the code—it's understanding the invisible data pipeline.

---

## 📊 The Dashboard (The Executable Result)

![Aura Skincare P&L Leak Dashboard](./Aura%20Skincare%20P%26L%20Leak%20Dashboard.png)

All this tracking is useless if a founder can't read it in 60 seconds. I built this dashboard in Looker Studio to answer three questions: **Where are we leaking money? What is the user psychology? What is causing hesitation?**

1.  **The Friction Funnel:** A native Looker Studio Funnel Chart mapping `quick_view_open` → `add_to_cart` → `cart_drawer_open` → `cart_abandon_shipping`. The bottom bar is highlighted in **Red**. This is the P&L leak.
2.  **The Psychology Split:** A Donut Chart showing **Hunters** vs. **Romantics**. It proves 75% of users don't care about the hero image.
3.  **Product Hesitation:** A Horizontal Bar Chart showing which product gets the most hover time.
4.  **The Executive Summary:** A text box with the final diagnosis and actionable recommendations.

---

## 🚀 The Real-World Application (Live D2C Audit)

This isn't just theory. I applied this exact same forensic methodology to a live, major Indian D2C apparel brand (name withheld for confidentiality).

I found 10 critical tracking errors, including:
*   CSP blocks on Google Ads and DoubleClick (wasting ad spend).
*   Duplicate Meta Pixels inflating audiences.
*   A Headless Checkout (GoKwik) flaw that was silently losing customer emails before they reached the CRM (CleverTap).

You can read the anonymized 1-page audit here: [D2C_Audit_Report_Anonymised.pdf](./D2C_Audit_Report_Anonymised.pdf)

---

**Built by Pulkit Shrivastava — Data Forensics Analyst**
*"I don't just build dashboards. I trace the data back to the source to see if it deserves to be believed."*
