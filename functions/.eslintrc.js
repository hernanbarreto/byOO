module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parserOptions : { 
    ecmaVersion : 2017 , 
    sourceType : "module" , 
    ecmaFeatures : { 
      jsx : true , 
      generators : true , 
      experimentalObjectRestSpread : true 
    } 
  } ,
  rules: {
    "quotes": [2, "double", "avoid-escape"],
    "max-len": ["error", {"code": 120}],
  },
};
