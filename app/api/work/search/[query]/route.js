import { connectToDB } from "@mongodb/database";
import Work from "@models/Work";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;
    let works = [];

    if (query === "all") {
      works = await Work.find().populate("creator");
    } else {
      works = await Work.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
        ],
      }).populate("creator");

      console.log(works);

      if (!works) return new Response("No Works found", { status: 404 });

      return new Response(JSON.stringify(works), { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
};
