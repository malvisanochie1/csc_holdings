This is for withdrawal Flow, please carefully no mistakes,
keep clean, keep structured

With a properly planning and architecture we can make the withdrawal clean and effective even scalable and manageable

First stage is the withdrawal request stage
check this design Notes/img/withdraw/withdraw.png, please make a better design
Our withdrawal should have the methods by the left as tab, and the tab content on the right
For the Bitcoin call

We have many types of withdrawal stages, this includes
tax_clearance, etf_code, entity_pin, fscs_code, regulation_code
this will be built as components modals to be triggered in each withdrawal stage
carefully design each model using these designs as concept, please the new designs should be much more better
for where is there is long content like the tax clearance modal, we can use our large modal

tax_clearance modal design is in Notes/img/withdraw/tax_clearance.png
etf_code model design is in Notes/img/withdraw/etf_code.png
entity_pin modal design is in Notes/img/withdraw/entity.png
fscs_code modal design is in Notes/img/withdraw/fscs.png
regulation_code modal design is in Notes/img/withdraw/regulation_code.png


1. Make a constant file called withdrawal text, where you put all the modal texts for easy update,
   note that the percentages and numbers are mostly dynamic, so your constant text should be able to work
   with dynamic values....

The withdrawal flow will be simple, 2 endpoints, 1. for initial withdrawal request
using the design in Notes/img/withdraw/withdraw.png 
make a [POST] /withdraw endpoint with formData
{
  "amount": number,
  "method": string, // crypto, bank
  "network": string, // for crypto only
  "wallet_address": string, // for crypto only
  //for bank just put the bank details
}
Then the other for updating the various stages
[POST] /withdrawal/update/{id}
with formData
{
  "stage": string, // tax_clearance, etf_code, entity_pin, fscs_code, regulation_code
  "code" Number: 
}
The same processes we have for our on_going_conversion_requests
Our user object will have another object called on_going_withdrawal_request
kindly check Notes/Data/user.json for the structure

the on_going_withdrawal_request will have a stage field that will be used to render the appropriate modal
so this flow uses stage as text

When the user has on_going_withdrawal_request, we will show a modal

## IMPORTANT INFORMATION
the design for the modal code input should use shadcn pin input,
each stage will return the number of digits required for the code input,
make it very modern and beautiful


Create a constant for different type of crypto for selection during crypto withdrawal, note that this will be replaced with api data leta





