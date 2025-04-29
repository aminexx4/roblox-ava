// api/avatar.js
export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Step 1: Get User ID from Username
    const userRes = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`);
    const userData = await userRes.json();

    if (!userData || userData.errorMessage || !userData.Id) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userData.Id;

    // Step 2: Get avatar thumbnail
    const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`);
    const thumbData = await thumbRes.json();

    const imageUrl = thumbData.data[0]?.imageUrl;

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to get avatar' });
    }

    res.status(200).json({ avatar: imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
