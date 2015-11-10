var Category = require('../models/category');
var _ = require('underscore');
// admin new page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
}
//category update movie
exports.update =  function(req, res) {
  var id = req.params.id;

  if(id) {
    Category.findById(id, function(err, category) {
      res.render('category_admin', {
        title: 'imooc 后台分类更新页',
        category: category
      })
    })
  }
}
//admin post category
exports.save = function(req, res) {
  var categoryObj = req.body.category;
  console.log('后台分类')
  console.log(categoryObj)
  var _category;
  var id = categoryObj._id;
  if(id) {
    Category.findById(id, function(err, category) {
      _category = _.extend(category, categoryObj);
      _category.save(function(err, category) {
        if(err) {
          console.log(err);
        }

        res.redirect('/admin/category/list'); 
      })
    })
  }else {
    _category = new Category(categoryObj);
    _category.save(function(err, category) {
      if(err) {
        console.log(err);
      }

      res.redirect('/admin/category/list'); 
    })   
  }
}

// categorylist page
exports.list = function(req, res) {
  Category.fetch(function(err, categories) {
    if(err) {
      console.log(err);
    }
    res.render('categorylist', {
      title: 'imooc 分类列表页',
      categories: categories
    })
  })  
}
//categorylist delete movie 
exports.del = function(req, res) {
  var id = req.query.id;

  if(id) {
    Category.remove({_id: id}, function(err, category) {
      if(err) {
        console.log(err)
      }
      else {
        res.json({success: 1})
      }
    })
  }
}