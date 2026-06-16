module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Add safe filter for rendering HTML
  eleventyConfig.addFilter("safe", function(str) {
    return str;
  });
  
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
