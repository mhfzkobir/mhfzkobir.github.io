// Import channels from an M3U file
const m3uUrl = 'https://denverisalive.vercel.app/Playlist/TATA_TV6.m3u'; // Replace with your M3U file URL

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
      window.open(channel.url, '_blank');
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
