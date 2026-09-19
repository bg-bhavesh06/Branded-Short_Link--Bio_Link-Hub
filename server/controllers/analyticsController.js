import Click from "../models/Click.js";
import ShortLink from "../models/ShortLink.js";

const getRangeParams = (range = "7d") => {
  const normalized = range.toLowerCase();
  const days = normalized === "90d" ? 90 : normalized === "30d" ? 30 : 7;
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (days - 1));
  return { days, startDate };
};

const getUserLinksData = async (userId) => {
  const links = await ShortLink.find({ user: userId }).select("_id shortCode originalUrl");
  return {
    links,
    linkIds: links.map((l) => l._id),
  };
};

/**
 * GET /api/v1/analytics/overview?range=7d
 */
export const getOverview = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { days, startDate } = getRangeParams(range);
    const { linkIds } = await getUserLinksData(req.user.userId);

    if (linkIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: { totalClicks: 0, uniqueVisitors: 0, averageDailyClicks: 0, returningVisitors: 0 },
      });
    }

    const matchStage = { shortLink: { $in: linkIds }, timestamp: { $gte: startDate } };

    const totalClicks = await Click.countDocuments(matchStage);
    const uniqueIps = await Click.distinct("ipHash", matchStage);
    const uniqueVisitors = uniqueIps.length;
    const averageDailyClicks = days > 0 ? Math.round((totalClicks / days) * 10) / 10 : 0;

    const returningAgg = await Click.aggregate([
      { $match: matchStage },
      { $group: { _id: "$ipHash", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "returningCount" },
    ]);
    const returningVisitors = returningAgg[0]?.returningCount || 0;

    return res.status(200).json({
      success: true,
      data: { totalClicks, uniqueVisitors, averageDailyClicks, returningVisitors },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/clicks-over-time?range=7d
 */
export const getClicksOverTime = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { days, startDate } = getRangeParams(range);
    const { linkIds } = await getUserLinksData(req.user.userId);

    const matchStage = { shortLink: { $in: linkIds }, timestamp: { $gte: startDate } };

    const clicksByDay = linkIds.length
      ? await Click.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              clicks: { $sum: 1 },
            },
          },
        ])
      : [];

    const clickMap = new Map(clicksByDay.map((c) => [c._id, c.clicks]));
    const data = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      data.push({
        date: dateStr,
        clicks: clickMap.get(dateStr) || 0,
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/top-links?range=7d
 */
export const getTopLinks = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { startDate } = getRangeParams(range);
    const { links, linkIds } = await getUserLinksData(req.user.userId);

    if (linkIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const matchStage = { shortLink: { $in: linkIds }, timestamp: { $gte: startDate } };

    const topAgg = await Click.aggregate([
      { $match: matchStage },
      { $group: { _id: "$shortLink", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);

    const linkMap = new Map(links.map((l) => [l._id.toString(), l]));
    const totalClicks = topAgg.reduce((acc, curr) => acc + curr.clicks, 0);

    const data = topAgg.map((item) => {
      const link = linkMap.get(item._id.toString());
      return {
        id: item._id,
        shortCode: link?.shortCode || "",
        originalUrl: link?.originalUrl || "",
        clicks: item.clicks,
        percentage: totalClicks > 0 ? Math.round((item.clicks / totalClicks) * 100) : 0,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/top-referrers?range=7d
 */
export const getTopReferrers = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { startDate } = getRangeParams(range);
    const { linkIds } = await getUserLinksData(req.user.userId);

    if (linkIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const matchStage = { shortLink: { $in: linkIds }, timestamp: { $gte: startDate } };
    const totalClicks = await Click.countDocuments(matchStage);

    const referrersAgg = await Click.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $cond: [
              { $or: [{ $eq: ["$referrer", ""] }, { $not: ["$referrer"] }] },
              "Direct / None",
              "$referrer",
            ],
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);

    const data = referrersAgg.map((r) => ({
      referrer: r._id,
      clicks: r.clicks,
      percentage: totalClicks > 0 ? Math.round((r.clicks / totalClicks) * 100) : 0,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/devices?range=7d
 */
export const getDevices = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { startDate } = getRangeParams(range);
    const { linkIds } = await getUserLinksData(req.user.userId);

    if (linkIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [
          { deviceType: "Desktop", clicks: 0, percentage: 0 },
          { deviceType: "Mobile", clicks: 0, percentage: 0 },
          { deviceType: "Tablet", clicks: 0, percentage: 0 },
        ],
      });
    }

    const matchStage = { shortLink: { $in: linkIds }, timestamp: { $gte: startDate } };
    const totalClicks = await Click.countDocuments(matchStage);

    const devicesAgg = await Click.aggregate([
      { $match: matchStage },
      { $group: { _id: "$deviceType", clicks: { $sum: 1 } } },
    ]);

    const map = new Map(devicesAgg.map((d) => [d._id, d.clicks]));
    const data = ["Mobile", "Desktop", "Tablet"].map((type) => {
      const count = map.get(type) || 0;
      return {
        deviceType: type,
        clicks: count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/recent
 */
export const getRecentClicks = async (req, res, next) => {
  try {
    const { linkIds } = await getUserLinksData(req.user.userId);

    if (linkIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const recent = await Click.find({ shortLink: { $in: linkIds } })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("shortLink", "shortCode originalUrl");

    const data = recent.map((c) => ({
      id: c._id,
      timestamp: c.timestamp,
      shortCode: c.shortLink?.shortCode || "",
      originalUrl: c.shortLink?.originalUrl || "",
      deviceType: c.deviceType,
      referrer: c.referrer || "Direct",
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
