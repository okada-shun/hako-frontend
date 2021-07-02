# Hako Finance Frontend

In this repository, writes about the frontend code of Hako Finance.  
Frontend has 4 items. Listed below.

## Hako Information

Displays hako's information. In particular,
1. hako's address (hako contract's address)
2. hako's balance of token
3. total supply of token
4. hako's credit to members ( = SUM(member's debt to hako))
5. hako's debt to members ( = SUM(member's credit to hako))
6. member count
7. upper limit of credit creation and credit lending

## User Information

Displays the user's information. In particular,
1. user's address (user account's address)
2. user's balance of token
3. sentence that the user is member or not
4. user's credit to hako
5. user's debt to hako
6. user's credit to other member (credit that user is lending to other member)
7. user's debt to other member (credit that user is borrowing from other member)
8. user's net assets ( = 2. + 4. - 5. + 6. - 7.)
9. borrow value that the user registered
10. borrow duration that the user registered

## Transactions

Displays the link to each transaction page. In particular,
1. transfer
2. transfer credit
3. join Hako
4. leave Hako
5. deposit token
6. withdraw token
7. register borrowing
8. lend credit
9. collect debt
10. return debt
11. create credit
12. reduce debt

## Transactions History

Displays the link to the above 12 transactions log page.