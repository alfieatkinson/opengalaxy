// src/app/media/[uuid]/page.tsx

import { type Metadata } from "next";
import { fetchMediaById } from "@/lib/media/api";
import { notFound } from "next/navigation";
import FullSizeImage from "@/components/FullSizeImage";

export const dynamic = "force-dynamic";

interface MediaPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: MediaPageProps): Promise<Metadata> => {
  const { uuid } = await params;
  const media = await fetchMediaById(uuid);

  if (!media) {
    return {
      title: "Media Not Found",
      description: "The requested media could not be found.",
    };
  }

  return {
    title: media.title,
    description: media.attribution,
    openGraph: {
      images: [{ url: media.thumbnail_url }],
    },
  };
};

const MediaPage = async ({ params }: MediaPageProps) => {
  const { uuid } = await params;
  const media = await fetchMediaById(uuid);

  if (!media) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="card bg-base-100 shadow-lg">
        <FullSizeImage media={media} />
        <div className="card-body text-white">
          <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
          <p className="mb-4">{media.attribution}</p> {/* your “description” */}
          <dl className="text-sm">
            <dt>Creator</dt>
            <dd>{media.creator ?? "Unknown"}</dd>
            <dt>License</dt>
            <dd>
              <a href={media.license_url} target="_blank" rel="noopener">
                {media.license} {media.license_version || ""}
              </a>
            </dd>
            <dt>Dimensions</dt>
            <dd>
              {media.width}x{media.height}
              {media.media_type === "audio" && `, ${media.duration}s`}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
