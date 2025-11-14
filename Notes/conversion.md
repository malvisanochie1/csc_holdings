This is the conversion flow Doc

On the Convert modal when click on the convert button make post request to
/conversion-requests
with formData
{
  "from_wallet_id": "..,
  "to_wallet_id": ".."
} 

The wallet ids is user_wallet_id of the selected wallet

The response is Notes/Data/conv.json

On onsuccess, refetch the current user

2. Make a function that refetches current user, call the function on page refresh 
the endpoint to get current user is /user

3. The auth user object is now updated, please check Notes/Data/user.json for the new user object structure

4. Implement the next modal, the next modal will show when the user.on_going_conversion_requests count is more than 1, we use the
conversion_request item .step to now knw the modal to render
5. please think deeply and implement the best ux flow

On the step 2 modal this message 
"You are required to pay a conversion fee ranging between 10.50% - 12.50% (Mind you a subscription of 12.50% would facilitate a full conversion) which is Equal to approximately $126 - $150 "
needs to get the percentage from user.assets where conversion_request object .from_wallet_id is asset.id
make a function that returns the asset from user object and use the  "conversion_rate": {
"min": "0.00",
"max": "0.00"
},

this need to be carefully handled, no error
