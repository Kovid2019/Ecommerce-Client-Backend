import cartCollection from "./CartSchema.js";

// Create a new cart item
export const createCart = (cartObj) => {
  return cartCollection(cartObj).save();
};

//get cart by user id
export const getCartByUserId = (userId) => {
  return cartCollection.find({ user_id: userId });
};

// find one cart
export const findCart = (filter) => {
  return cartCollection.findOne(filter);
};

// UPDATE
export const updatedCart = (updatedObject) => {
  return cartCollection.findByIdAndUpdate(updatedObject?._id, updatedObject, {
    new: true,
  });
};

// DELETE
export const deleteCartById = (_id) => {
  return cartCollection.findByIdAndDelete(_id);
};

// GET ALL Carts
export const findCarts = (filter) => {
  return cartCollection.find(filter);
};
