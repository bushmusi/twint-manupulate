module.exports = mongoose => {
    const Arsenal = mongoose.model(
      "arsenal",
      mongoose.Schema(
        {
            id:String,
            conversation_id:String,
            created_at:String,
            date:String,
            time:String,
            timezone:String,
            user_id:String,
            username:String,
            name:String,
            place:String,
            tweet:String,
            language:String,
            mentions:Array,
            urls:Array,
            photos:Array,
            replies_count:String,
            retweets_count:String,
            likes_count:String,
            hashtags:Array,
            cashtags:Array,
            link:String,
            retweet:String,
            quote_url:String,
            video:String
        },
        { timestamps: true }
      )
    );
  
    return Arsenal;
  };