const { Notices } = require('../../models');
const { HttpError } = require('../../helpers');

const PER_PAGE = 20;
const getNoticesByCategory = async (req, res, next) => {
  const { categoryName } = req.params;
  const { search = '' } = req.query;
  console.log('getNoticesByCategory');
  // const { categoryName = 'sell' } = req.query;
  const { page = 1, limit = PER_PAGE } = req.query;
  const skip = (page - 1) * limit;

  if (!categoryName) {
    throw HttpError(400, `invalid categoryName`);
  }
  let noticesList = [];
  let totalHits = 0;
  if (search) {
    console.log('search', search);
    // noticesList = await Notices.find({ categoryName, title: search }, '', {
    //   skip,
    //   limit,
    // });
    const searchRegexp = new RegExp(search);
    noticesList = await Notices.find(
      { comments: { $regex: searchRegexp } },
      // {
      //   // $or: [{ comments: { $regex: search } }, { title: { $regex: search } }],
      // },
      '',
      {
        skip,
        limit,
      }
    );
    //  totalHits = await Notices.find({
    //    $or: [{ comments: { $regex: search } }, { title: { $regex: search } }],
    //  }).count();
    totalHits = await Notices.find({
      comments: { $regex: searchRegexp },
    }).count();
  } else {
    noticesList = await Notices.find({ categoryName }, '', {
      skip,
      limit,
    });
    totalHits = await Notices.find({ categoryName }).count();
  }

  res.json({
    message: noticesList,
    search,
    page,
    totalHits,
  });
};
module.exports = getNoticesByCategory;
