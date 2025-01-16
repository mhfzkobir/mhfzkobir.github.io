const m3uUrl = 'https://raw.githubusercontent.com/MohammadKobirShah/KobirIPTV/refs/heads/main/KobirIPTV.m3u'; // Replace with your M3U file URL

let channels = [];
const playerContainer = document.getElementById('player-container');
const playerDiv = document.getElementById('player');
const channelContainer = document.getElementById('channel-container');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');

let player; // JW Player instance

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
      const matchGroup = line.match(/group-title="([^"]+)"/);
      const matchLogo = line.match(/tvg-logo="([^"]+)"/);
      const channelName = line.split(',').pop();

      currentChannel = {
        name: channelName.trim(),
        url: null,
        category: matchGroup ? matchGroup[1] : 'Uncategorized',
        logo: matchLogo ? matchLogo[1] : null,
      };
    } else if (line.trim() && !line.startsWith('#')) {
      currentChannel.url = line.trim();
      channels.push(currentChannel);
    }
  });

  displayChannels(channels);
  populateCategories();
  initializePlayer(); // Initialize JW Player
}

// Display channels in grid view
function displayChannels(channelList) {
  channelContainer.innerHTML = '';
  channelList.forEach((channel) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      ${channel.logo ? `<img src="${channel.logo}" alt="${channel.name} Logo">` : ''}
      <h3>${channel.name}</h3>
    `;
    card.addEventListener('click', () => playChannel(channel.url));
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

// Play channel in JW Player
function playChannel(url) {
  if (player) {
    player.load([{ file: url }]);
    player.play();
  }
}

// Initialize JW Player
function initializePlayer() {
  player = jwplayer('player');
  player.setup({
    file: '',
    width: '100%',
    height: '100%',
    controls: true,
    autostart: false,
    skin: {
      name: 'seven',
    },
  });
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
