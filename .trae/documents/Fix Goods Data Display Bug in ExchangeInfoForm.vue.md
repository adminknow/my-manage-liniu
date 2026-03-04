## Bug Analysis
The goods data is not displaying because of an issue in the `changeGoodsData` function. When a user selects a good from the dropdown, the function fetches the goods details but fails to properly update the goods array in a way that triggers Vue's reactivity.

## Root Cause
In the `changeGoodsData` function, the code is using `forEach` to iterate through the goods array and update the selected item. While this approach modifies the object properties, it doesn't ensure that Vue detects the changes properly, especially with nested properties.

## Fix Plan
1. **Modify the changeGoodsData function** to directly update the specific item in the goods array using index access instead of forEach
2. **Ensure proper reactivity** by using Vue's reactivity system correctly
3. **Add error handling** to the API call to provide feedback if the goods details fetch fails
4. **Test the fix** by selecting goods from the dropdown and verifying they display correctly

## Implementation Steps
1. Locate the `changeGoodsData` function in the script section
2. Replace the forEach loop with direct index access to update the goods item
3. Add proper error handling for the API call
4. Test the fix by running the application and selecting goods

This fix will ensure that when a user selects a good from the dropdown, the goods details are fetched and displayed correctly in the form.