import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookbg from "../assets/bookbg.avif";

import blogimage1 from "../assets/blogimage1.avif";
import blogimage2 from "../assets/blogimage2.jpg";
import blogimage4 from "../assets/blogimage4.avif";
import blogimage5 from "../assets/blogimage5.webp";
import blogimage8 from "../assets/blogimage8.jpg";

const blogs = [
  {
    id: 1,
    date: "13/01",
    title: "The Cotton Jersey Zip-Up Hoodie",
    excerpt:
      "The Cotton Jersey Zip-Up Hoodie is a versatile and comfortable outerwear piece that combines style and functionality. Crafted from high-quality cotton jersey fabric, this hoodie offers a cozy feel and a casual yet fashionable look.",
    image: blogimage2,
  },
  {
    id: 2,
    date: "13/04",
    title: "How to Style a Quiff",
    excerpt:
      "The Quiff is a timeless and sophisticated hairstyle that never fails to make a statement. With its voluminous and sculpted front, it adds a touch of elegance and charm to any look.",
    image: blogimage8,
  },
  {
    id: 3,
    date: "12/01",
    title: "Must-Have Skater Girl Items",
    excerpt:
      "Must-Have Skater Girl Items are essential for adding a cool and edgy vibe to your wardrobe. From skateboard to streetwear, these items perfectly capture the skater girl aesthetic.",
    image: blogimage1,
  },
  {
    id: 4,
    date: "16/01",
    title: "Runway-Inspired Trends",
    excerpt:
      "Runway-Inspired Trends are the ultimate source of fashion inspiration, bringing high-end style to everyday life. From bold prints to statement accessories, these trends allow you to express your creativity and stay ahead of the fashion curve.",
    image: blogimage5,
  },
  {
    id: 5,
    date: "10/03",
    title: "AW20 Menswear Trends",
    excerpt:
      "AW20 Menswear Trends are all about blending sophistication with a touch of rebellion. From tailored outerwear to statement accessories, these trends offer a contemporary and stylish approach to men's fashion.",
    image: blogimage4,
  },
  {
    id: 6,
    date: "08/02",
    title: "Top 10 Fashion Trends to Watch This Summer 2025",
    excerpt:
      "From oversized linen blazers to bold colour-blocking, this summer's runway is packed with looks you can actually wear every day. We break down the top trends and how to style them.",
    image:
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=900&q=80",
  },
];

const POSTS_PER_PAGE = 4;

export default function Blog() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const paginated = blogs.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/*
          HERO — #readmore banner*/}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "285px",
          overflow: "hidden",
        }}
      >
        <img
          src={bookbg}
          alt="Background"
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center 40%",
            filter: "brightness(0.48)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "68px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#fff",
              letterSpacing: "-1px",
              lineHeight: 1,
              fontFamily: "Georgia, serif",
            }}
          >
            #readmore
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "14px",
              color: "rgba(255,255,255,0.82)",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontStyle: "normal",
              letterSpacing: "0.02em",
            }}
          >
            Read all case studies about our products!
          </p>
        </div>
      </div>

      {/* ═══════════════════════════
          BLOG LIST
      ═══════════════════════════ */}
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 40px" }}>
        {paginated.map((blog) => (
          <div key={blog.id} style={{ paddingTop: "56px", paddingBottom: "0" }}>
            {/* Date watermark */}
            <div
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: "90px",
                fontWeight: 900,
                color: "#d0d0d0",
                lineHeight: 1,
                marginBottom: "4px",
                letterSpacing: "-2px",
                userSelect: "none",
              }}
            >
              {blog.date}
            </div>

            {/* Image + Text row */}
            <div style={{ display: "flex", alignItems: "stretch" }}>
              {/* Image — ~50% width, fixed height */}
              <div
                style={{
                  width: "50%",
                  flexShrink: 0,
                  height: "340px",
                  overflow: "hidden",
                  background: "#f0f0f0",
                }}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Text — right half, vertically centered */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "32px 56px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1.35,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {blog.title}
                </h2>

                <p
                  style={{
                    margin: "0 0 28px 0",
                    fontSize: "14px",
                    lineHeight: 1.75,
                    color: "#555",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {blog.excerpt}
                </p>

                {/* CONTINUE READING ——— */}
                <button
                  onClick={() => navigate(`/blog/${blog.id}`)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#111",
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Continue Reading
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "44px",
                      height: "1.5px",
                      background: "#111",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ═══════════════════════════
            PAGINATION
        ═══════════════════════════ */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            padding: "72px 0 80px",
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                width: "42px",
                height: "42px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                background: page === p ? "#008073" : "#e0e0e0",
                color: page === p ? "#fff" : "#444",
                transition: "background 0.15s",
              }}
            >
              {p}
            </button>
          ))}
          {page < totalPages && (
            <button
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                width: "42px",
                height: "42px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                background: "#e0e0e0",
                color: "#444",
              }}
            >
              →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
