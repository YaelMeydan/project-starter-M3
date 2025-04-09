export function displayMessage(message: string, type: 'success' | 'error' = 'success') {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.className = type === 'success' ? 'success-message' : 'error-message';
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.className = '';
        }, 3000);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

export function navigate(path: string) {
    window.location.href = path;
}

export const handleHomePage = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Logout failed');
                }

                const data = await response.json();
                if (data.message && data.redirect) {
                    displayMessage(data.message, 'success');
                    navigate(data.redirect);
                }
            } catch (error: any) {
                displayMessage(error.message, 'error');
            }
        });
    }


    const collectionToggle = document.getElementById('collection-toggle');
    const communityToggle = document.getElementById('community-toggle');
    const collectionView = document.getElementById('collection-view');
    const communityView = document.getElementById('community-view');

    const showCollectionView = async () => {
        if (collectionView && communityView) {
            collectionView.style.display = 'block';
            communityView.style.display = 'none';
            collectionToggle?.classList.add('active');
            communityToggle?.classList.remove('active');
            try {
                await loadUserCollection();
            } catch (error: any) {
                console.error("Error loading user collection:", error);
                displayMessage("Failed to load your collection.", 'error');
            }
        }
    };

    const showCommunityView = async () => {
        if (collectionView && communityView) {
            collectionView.style.display = 'none';
            communityView.style.display = 'block';
            communityToggle?.classList.add('active');
            collectionToggle?.classList.remove('active');
            try {
                await loadCommunityBooks();
            } catch (error: any) {
                console.error("Error loading community books:", error);
                displayMessage("Failed to load community books.", 'error');
            }
        }
    };

    if (collectionToggle && communityToggle) {
        collectionToggle.addEventListener('click', showCollectionView);
        communityToggle.addEventListener('click', showCommunityView);
        showCollectionView();
    }

    const addBookButton = document.getElementById('add-book-button');
    if (addBookButton) {
        addBookButton.addEventListener('click', () => {
            renderAddBookForm();
        });
    }
};


function renderAddBookForm() {
    const addBookFormContainer = document.getElementById('add-book-form-container');
    if (addBookFormContainer) {
        addBookFormContainer.innerHTML = `
            <h3>Add a New Book</h3>
            <form id="add-new-book-form">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required><br><br>

                <label for="author">Author:</label>
                <input type="text" id="author" name="author" required><br><br>

                <button type="submit" class="btn primary">Submit</button>
            </form>
            <div id="search-results-container"></div>
        `;

        const addNewBookForm = document.getElementById('add-new-book-form') as HTMLFormElement;
        if (addNewBookForm) {
            addNewBookForm.addEventListener('submit', handleAddNewBook);
        }
    }
}


async function handleAddNewBook(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;

    try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(title)}&query=${encodeURIComponent(author)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error searching for books');
        }
        const searchResponse = await response.json();
        const searchResultsContainer = document.getElementById('search-results-container');

        if (searchResultsContainer) {
            searchResultsContainer.innerHTML = '';

            if (searchResponse.data && searchResponse.data.length > 0) {
                searchResultsContainer.innerHTML = '<h4>Did you mean:</h4>';
                searchResponse.data.forEach(book => {
                    const bookButton = document.createElement('button');
                    bookButton.textContent = `${book.title} by ${book.author}`;
                    bookButton.addEventListener('click', () => addBookToCollection(book._id));
                    searchResultsContainer.appendChild(bookButton);
                });

                const newBookButton = document.createElement('button');
                newBookButton.textContent = 'New Book To Add';
                newBookButton.addEventListener('click', () => submitNewBook({ title, author }));
                searchResultsContainer.appendChild(newBookButton);
            } else {

                await submitNewBook({ title, author });
            }
        }
    } catch (error: any) {
        displayMessage('Error adding book: ' + error.message, 'error');
    }
}


async function addBookToCollection(bookId: string) {
    try {
        const response = await fetch(`/api/books/${bookId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty body for POST request
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error adding book to collection');
        }
        const data = await response.json();
        displayMessage(data.message, 'success');
        await loadUserCollection(); // Refresh collection
        const searchResultsContainer = document.getElementById('search-results-container');
        if (searchResultsContainer) {
            searchResultsContainer.innerHTML = ''; // Clear search results
        }
    } catch (error: any) {
        displayMessage('Error adding book: ' + error.message, 'error');
    }
}

// Submit a new book
async function submitNewBook(bookData: { title: string; author: string }) {
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error creating book');
        }
        const data = await response.json();
        displayMessage(data.message, 'success');
        await loadUserCollection(); // Refresh collection
        const addBookFormContainer = document.getElementById('add-book-form-container');
        if (addBookFormContainer) {
            addBookFormContainer.innerHTML = '<button id="add-book-button" class="btn primary">Add a book</button>';
            const newAddBookButton = document.getElementById('add-book-button');
            if (newAddBookButton) {
                newAddBookButton.addEventListener('click', () => {
                    renderAddBookForm();
                });
            }
        }
    } catch (error: any) {
        displayMessage('Error adding book: ' + error.message, 'error');
    }
}

// Load the user's book collection
async function loadUserCollection() {
    const bookListContainer = document.getElementById('book-list-container');
    if (bookListContainer) {
        bookListContainer.innerHTML = 'Loading your collection...';
        try {
            const response = await fetch('/api/books/collection');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error fetching collection');
            }
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                bookListContainer.innerHTML = data.data.map(book => `
                    <div class="book-item">
                        ${book.title} by ${book.author}
                    </div>
                `).join('');
            } else {
                bookListContainer.innerHTML = 'Your collection is empty. Add a book!';
            }
        } catch (error: any) {
            bookListContainer.innerHTML = '<div class="error-message">Error fetching collection</div>';
        }
    }
}

// Load community books
async function loadCommunityBooks() {
    const communityBookListContainer = document.getElementById('community-book-list-container');
    if (communityBookListContainer) {
        communityBookListContainer.innerHTML = 'Loading community books...';
        try {
            const response = await fetch('/api/books');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error fetching community books');
            }
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                communityBookListContainer.innerHTML = data.data.map(book => `
                    <div class="book-item">
                        <strong>${book.title}</strong> by ${book.author} (${book.followers.length} followers)
                        <button class="btn primary review-button" data-book-id="${book._id}">Leave Review</button>
                    </div>
                `).join('');

                // Attach event listeners to review buttons
                document.querySelectorAll('.review-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const bookId = (event.target as HTMLButtonElement).dataset.bookId;
                        renderReviewForm(bookId!);
                    });
                });
            } else {
                communityBookListContainer.innerHTML = 'No books found in the community.';
            }
        } catch (error: any) {
            communityBookListContainer.innerHTML = '<div class="error-message">Error fetching community books</div>';
        }
    }
}

// Render the review form
function renderReviewForm(bookId: string) {
    const communityBookListContainer = document.getElementById('community-book-list-container');
    if (communityBookListContainer) {
        communityBookListContainer.innerHTML = `
            <h3>Leave a Review</h3>
            <form id="review-form">
                <label for="review-text">Your Review:</label><br>
                <textarea id="review-text" name="review-text" rows="4" cols="50" required></textarea><br><br>
                <button type="submit" class="btn primary">Submit Review</button>
            </form>
        `;

        const reviewForm = document.getElementById('review-form') as HTMLFormElement;
        if (reviewForm) {
            reviewForm.addEventListener('submit', (event) => {
                event.preventDefault();
                handleLeaveReview(bookId, event);
            });
        }
    }
}

// Handle leaving a review
async function handleLeaveReview(bookId: string, event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const reviewText = formData.get('review-text') as string;

    try {
        const response = await fetch(`/api/books/${bookId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: reviewText }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error leaving review');
        }
        const data = await response.json();
        displayMessage(data.message, 'success');
        await loadCommunityBooks(); // Refresh community books
    } catch (error: any) {
        displayMessage('Error leaving review: ' + error.message, 'error');
    }
}