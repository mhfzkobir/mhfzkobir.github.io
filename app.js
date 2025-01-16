// Import channels from an M3U file
const m3uUrl = 'https://raw.githubusercontent.com/MohammadKobirShah/KobirIPTV/refs/heads/main/KobirIPTV.m3u'; // Replace with your M3U file URL

let channels = [];
const channelContainer = document.getElementById('channel-container');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');

// Fetch and parse M3U file
async function fetchChannels() {
  const response = await fetch(m3uUrl);
  const text = await response.text();
  parseM3U(text);
}

// Parse M3U file content
function parseM3U(m3uContent) {
  const lines = m3uContent.split('\n');
  let currentChannel = {};
  
  lines.forEach((line) => {
    if (line.startsWith('#EXTINF')) {
      const info = line.split(',')[1];
      currentChannel = { name: info, url: null, category: 'Uncategorized' };
    } else if (line.trim() && !line.startsWith('#')) {
      currentChannel.url = line.trim();
      channels.push(currentChannel);
    }
  });
  displayChannels(channels);
  populateCategories();
}

// Display channels in grid view
function displayChannels(channelList) {
  channelContainer.innerHTML = '';
  channelList.forEach((channel) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${channel.name}</h3>
    `;
    card.addEventListener('click', () => {
      playChannel(channel.url, channel.name);
    });
    channelContainer.appendChild(card);
  });
}

// Populate categories dynamically
function populateCategories() {
  const categories = [...new Set(channels.map((channel) => channel.category))];
  categorySelect.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Play channel in a full-window JW Player instance
function playChannel(url, title) {
  const newWindow = window.open('', '_blank', 'width=100%,height=100%');
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <script src="https://cdn.jwplayer.com/libraries/IDzF9Zmk.js"></script>
    </head>
    <body style="margin:0;padding:0;background:#000;">
      <div id="player" style="width:100%;height:100vh;"></div>
      <script>
        const player = jwplayer("player");
        player.setup({
          file: "${url}",
          width: "100%",
          height: "100%",
          controls: true,
          autostart: true,
          skin: {
            name: "seven", // Choose a modern JW Player skin
          }
        });
      </script>
    </body>
    </html>
  `);
}

// Search functionality
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm)
  );
  displayChannels(filteredChannels);
});

// Category filtering
categorySelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  const filteredChannels =
    selectedCategory === 'all'
      ? channels
      : channels.filter((channel) => channel.category === selectedCategory);
  displayChannels(filteredChannels);
});

// Initialize
fetchChannels();
