# item-database

This project was a way to quickly do a project my mom wanted a way to store a lot of nail plates she has without pulling out all of them out of boxes. Also a way to explore docker and superbase locally.

## You will need

- Docker
- Node v24

## How to see it?

- Start docker
- in a terminal do the following
- git clone https://github.com/ACipherEXE/item-database.git
- cd item-database
- npm install
- superbase start
- let it run and then open the superbase gui
- http://127.0.0.1:54323/project/default
- Go to the sql editor
- CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10, 2),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

);
- enter the above
- It should make a table
- enter this as well
- GRANT UPDATE ON public.items TO anon;
- On the sidebar, go to authentication
- policies make the following for the table
<img width="861" height="1450" alt="image" src="https://github.com/user-attachments/assets/7f09ba7d-a484-4ad1-920b-24bf5b947dfc" />
<img width="847" height="1450" alt="image" src="https://github.com/user-attachments/assets/ebdeb14f-36f3-42ad-9f63-371815257f1a" />

<img width="859" height="1436" alt="image" src="https://github.com/user-attachments/assets/d35f3ac2-8bb8-486c-962d-995a2441ff4e" />
- 

 

## What does it do?

- Adds items to a large list
- Displays the total of items
- Search items by Name, brand, category, and tags
- You can edit any item name, brand, category, tags and images.
- There is an image lookup and download of manology plates

## image

<img width="687" height="1305" alt="image" src="https://github.com/user-attachments/assets/88f59c78-26bf-4087-8855-cbf31a872c9b" />

## Why is there no delete button

- You can't lose data, you can't erase yourself

## Will I continue?

- Yeah, I need to polish what's already here and build an offline variant.
- Mom is testing this project and a server has been made locally
