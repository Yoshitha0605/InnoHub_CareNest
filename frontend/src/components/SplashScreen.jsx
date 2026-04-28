import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-950 via-violet-950 to-cyan-900 text-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <motion.div
          className="text-6xl font-extrabold text-white"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          CareNest
        </motion.div>
        <p className="mt-4 text-xl text-cyan-200">From Prediction to Protection</p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;