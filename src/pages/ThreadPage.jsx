import { useParams } from "react-router-dom";
import { useThread, useAcceptThread } from "../hooks/useThread";
import TopBar from "../components/TopBar/TopBar";
import ThreadContent from "../components/ThreadContent/ThreadContent";
import Loader from "../components/Loader/Loader";
import { ErrorDisplay } from "../components/ErrorDisplay/ErrorDisplay";
import "./ThreadPage.scss";

export default function ThreadPage() {
  const { cfskey, cfstoken } = useParams();
  const { thread, loading, error, refetch } = useThread(cfskey, cfstoken);
  const { acceptThread, accepting, acceptError } = useAcceptThread();

  const handleAccept = async () => {
    const result = await acceptThread(cfskey, cfstoken, thread);
    if (result.success) {
      await refetch();
    }
  };

  return (
    <div className="thread-page">
      <TopBar thread={thread} />

      <main className="thread-page__main">
        {loading && <Loader />}

        {!loading && error && (
          <div className="thread-page__container">
            <ErrorDisplay message={error} />
          </div>
        )}

        {!loading && !error && thread && (
          <div className="thread-page__container">
            <ThreadContent
              thread={thread}
              onAccept={handleAccept}
              accepting={accepting}
              acceptError={acceptError}
            />
          </div>
        )}
      </main>
    </div>
  );
}
