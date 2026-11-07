# IRONFORGE Gym - Staff Panel

The private memberships panel for gym staff. New memberships from the gym website appear here live, with the plan, amount and payment details, and staff can update their status.

## Folder structure

    ironforge-gym-staff/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── app.js               (sign-in, live memberships, filters, status updates, sound alert)
        └── firebase-config.js   (Firebase keys, already filled in)

## Features

- Staff sign-in with email and password (Firebase Authentication)
- Live memberships list: new joins appear without refreshing the page
- A beep plays when a new membership arrives (Sound on/off button at the top)
- Summary counts: Total, Pending, Active and Expired
- Filter by status and plan, and search by ID, name or email
- Details for each membership: name, email, plan, Monthly or Yearly billing, amount in PKR, payment method and transaction ID
- Statuses: Pending, Active, Expired, Cancelled
- Dark and light theme, mobile friendly

## How it connects

1. A visitor joins on the gym website and confirms the payment step.
2. The membership is saved in the Firestore collection `gymMembers`.
3. This panel reads the same collection and shows it instantly.
4. When staff change a status here, the document is updated in Firestore.

Both sites use the same Firebase project (`hasan-mart`) and the same config.

## Setup

1. The Firebase config is already in `js/firebase-config.js`.
2. In Firebase go to Authentication > Users and make sure the staff account exists (Add user if it does not), with a strong password.
3. In Firestore Database > Rules, make sure the `gymMembers` block is present and contains the staff email (see the gym website README for the complete rules). To allow two staff members use:
   `request.auth.token.email in ['staff1@gmail.com', 'staff2@gmail.com']`
4. Make sure `syedhasanshahqadri-ops.github.io` is listed under Authentication > Settings > Authorized domains.

## Publishing on GitHub Pages

1. Create a repository named `ironforge-gym-staff`.
2. Upload the contents of this folder to the root of the repository.
3. Go to Settings > Pages, choose the `main` branch and the root folder, then save.
4. Your link: `https://syedhasanshahqadri-ops.github.io/ironforge-gym-staff/`

## Using the panel

1. Open the link and sign in with the staff email and password.
2. New memberships appear at the top with the status **Pending** and a highlighted edge.
3. Click a membership to see the member's details and payment information.
4. For Easypaisa and JazzCash payments, check the transaction ID and amount in your payment app. For cash, confirm the payment at the front desk.
5. Set the status to **Active** once the payment is confirmed. Use **Expired** when a membership ends and **Cancelled** when it is cancelled.
6. Contact the member by email using the address shown.
7. Use Sign out when you finish, especially on a shared device.

## Troubleshooting

- **"Setup needed":** `js/firebase-config.js` is empty or missing.
- **"Sign-in failed":** wrong email or password, or the user does not exist in Authentication.
- **"Cannot load memberships: Missing or insufficient permissions":** the email in the rules does not match the account you signed in with, the `gymMembers` block is missing, or the rules were not published.
- **No memberships appear:** the gym website may still be in demo mode, or a visitor left before confirming the payment step (those are not saved).
- **No beep:** the browser blocks sound until you interact with the page. Sign in on that device and check that Sound is on.
- **A status will not change:** you are probably signed in with an account that is not listed in the rules.

## Security notes

- Never write the staff password in the code.
- Use a strong password and change it if it is ever shared in a chat or message.
- Do not link to this panel from the gym website, and share its link only with staff.
- Delete test memberships from the Firebase console before going live.# ironforge-gym-staff
