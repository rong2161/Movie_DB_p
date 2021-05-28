- Project: Movie Database

- Individual Project (no partner)

- OpenStack
	- instance name: RongQZ
	- public IP: 134.117.133.220
	- username: student
	- password: *******

- Porject file location: /home/student/Desktop/COMP2406 Course Project

- run node myDB-loader.js (to reset and initialize the database, if the database is corrupted)
	- may take 1 min or so to build the database
		expected prompt:
			> director loading Done...wait for writer loading...
			> writer loading Done...wait for actors loading...
			> actor loading Done...wait for dropping DB
			> Dropped database. Starting re-creation.
			> All people saved.
			> All users saved.
			> All movies saved.
			> All Loading Complete
			(wait till it prompt > All Loading Complete. then press ^C to exit.)
	
	
- run node server.js  (to start)


- functionality implemented successfully:

	Login Page:
		+ log in to account
		+ sign up for an account
	
	Account Page:
		+ search movie
		+ change user status (regular, contributor)
	
	Viewing Movies:
		+ see basic movie information (title, release year, average rating, runtime, plot)
		+ genre keywords (navigate to genre search results)
		+ see the director, writer, actor (navigate to person page)

	Viewing People:
		+ see history of all the person's work (navigate to movie page)

	Viewing other users:
		+ see other users profile (navigate to user page)
	
	Missing functionalities:
		- view and manage followed people/user
		- view recommended and similar movies
		- add reviews
		- add/edit movie to database


- extensions: MongoDB


- Design decisions:
	+ implemented MongoDB increased scalability make the code cleaner and query easier 
	+ dynamic header: always has a link back to account page no matter what page you are in
	+ Incease security by binding session to login account.only able to access to the account page with matching session. 

- potential improvement:
	- using promise to decrease the running time of myDB-loader.js
	- able to effectively using chaining promise, await and thenables with asynchronous functions. (failed using them in the project)

- It is a well-rounded project, by doing the project I have learned a lot of new things and able to combine what I have learned into one piece.  


	
	
