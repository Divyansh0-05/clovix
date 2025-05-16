import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react'; // Changed X to Trash2
import { motion } from 'framer-motion';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // Added imageUrl
}

interface CartProps {
  items: CartItem[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onIncrease, onDecrease, onRemove, onClose }) => {
  const buttonVariants = {
    rest: { scale: 1, rotateX: 0, transition: { duration: 0.2 } },
    hover: { scale: 1.1, rotateX: 15, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    rest: { y: 0, rotateX: 0, transition: { duration: 0.3 } },
    hover: { y: -8, rotateX: 8, transition: { duration: 0.3 } }
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50 perspective-1000">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-60" onClick={onClose} />
      <motion.div
        className="relative w-96 bg-gradient-to-b from-purple-50 to-indigo-50 shadow-2xl p-6 rounded-l-3xl flex flex-col h-full"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center border-b border-purple-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-purple-900">Your Cart</h2>
          <motion.button
            onClick={onClose}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            className="text-purple-700 p-2 rounded-full bg-purple-100 hover:bg-purple-200"
          >
            <Trash2 className="w-6 h-6" /> {/* Changed X to Trash2 for close button */}
          </motion.button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 flex-1">
            <motion.p
              className="text-xl font-medium text-purple-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Add Things You Like! 🛒
            </motion.p>
            <p className="text-purple-500 mt-2">Explore and fill your cart with treasures</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-5">
            <ul className="space-y-5">
              {items.map(item => (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  initial="rest"
                  whileHover="hover"
                  className="flex items-center bg-white p-4 rounded-xl shadow-md border border-purple-100"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-purple-900">{item.name}</h3>
                    <p className="text-indigo-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => onDecrease(item.id)}
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      className="text-purple-700 bg-purple-100 p-2 rounded-full hover:bg-purple-200"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="text-lg font-medium w-8 text-center text-purple-800">{item.quantity}</span>
                    <motion.button
                      onClick={() => onIncrease(item.id)}
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      className="text-purple-700 bg-purple-100 p-2 rounded-full hover:bg-purple-200"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onRemove(item.id)}
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      className="text-red-500 p-2 rounded-full bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" /> {/* Changed X to Trash2 */}
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0px 12px 24px rgba(124, 58, 237, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:from-purple-700 hover:to-indigo-700"
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;